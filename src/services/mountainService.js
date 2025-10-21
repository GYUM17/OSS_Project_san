const API_BASE_URL = "https://openapi.gg.go.kr/Mntninfostus";
const DEFAULT_IMAGE = "/mou.jpg";
const DEFAULT_THEME = "힐링";

const API_KEY = "89c058836d2349f0957a1619b03ddf3e";

const detailCache = new Map();
const mountainListCache = new Map();

function buildQuery({ page, perPage, region, keyword } = {}) {
  const params = new URLSearchParams({
    KEY: API_KEY,
    Type: "json",
    pIndex: String(page ?? 1),
    pSize: String(perPage ?? 12),
  });

  if (region && region !== "지역선택") {
    params.set("SIGUN_NM", region);
  }

  if (keyword) {
    params.set("searchWrd", keyword);
  }

  return params;
}

function normalizeText(text, fallback = "정보가 제공되지 않았습니다.") {
  if (typeof text !== "string") return fallback;
  const trimmed = text.trim();
  if (!trimmed) return fallback;
  return trimmed;
}

function extractProvince(locationText) {
  if (typeof locationText !== "string") return null;
  const cleaned = locationText.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;

  const separators = /[ ,ㆍ/]+/;
  const tokens = cleaned.split(separators).map((token) => token.trim()).filter(Boolean);

  const suffixes = [
    "특별자치도",
    "광역시",
    "특별시",
    "특별자치시",
    "도",
    "시",
  ];

  for (const token of tokens) {
    for (const suffix of suffixes) {
      if (token.endsWith(suffix)) {
        return token;
      }
    }
  }

  return tokens[0] ?? cleaned;
}

function extractProvinceAndCity(locationText) {
  if (typeof locationText !== "string") return null;
  const separators = /[ ,ㆍ/]+/;
  const tokens = locationText.split(separators).map((token) => token.trim()).filter(Boolean);
  if (tokens.length === 0) return null;

  const province = extractProvince(tokens[0]) ?? tokens[0];

  const citySuffixes = ["시", "군", "구", "읍", "면"];
  for (let i = 1; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (citySuffixes.some((suffix) => token.endsWith(suffix))) {
      return `${province} ${token}`;
    }
  }

  return province;
}

function normalizeDifficulty(heightValue) {
  if (heightValue == null) return "중";
  const height = Number(heightValue);
  if (Number.isNaN(height)) return "중";
  if (height >= 1200) return "상";
  if (height >= 700) return "중";
  return "하";
}

function normalizeRow(row) {
  const id = row?.MNTN_CD_INFO || row?.MNTN_NM;
  const height =
    typeof row?.MNTN_HG_VL === "number"
      ? row.MNTN_HG_VL
      : Number(row?.MNTN_HG_VL) || null;

  return {
    id,
    title: normalizeText(row?.MNTN_NM, "이름 미상"),
    location:
      extractProvinceAndCity(row?.MNTN_LOCPLC_REGION_NM) ??
      normalizeText(row?.MNTN_LOCPLC_REGION_NM, "위치 정보 없음"),
    image: normalizeText(row?.MNTN_INFO_IMAGE_URL, DEFAULT_IMAGE),
    difficulty: normalizeDifficulty(height),
    height,
    theme: DEFAULT_THEME,
    summary:
      normalizeText(row?.MNTN_INFO_SUMRY_DTCONT) ||
      normalizeText(row?.DETAIL_INFO_DTCONT),
  };
}

function normalizeDetail(row, meta = {}) {
  const base = normalizeRow(row);
  return {
    ...base,
    description:
      normalizeText(row?.DETAIL_INFO_DTCONT, "") || base.summary,
    summary: normalizeText(row?.MNTN_INFO_SUMRY_DTCONT, base.summary),
    transport: normalizeText(row?.TRNSPORT_INFO, "교통 정보가 제공되지 않았습니다."),
    tourismInfo: normalizeText(
      row?.CIRCUMFR_TURSM_INFO_DTCONT,
      "주변 관광 정보가 제공되지 않았습니다."
    ),
    managingInstitution: normalizeText(
      row?.MNTN_MANAGE_MAINBD_INST_NM,
      "관리 기관 정보가 없습니다."
    ),
    height:
      typeof row?.MNTN_HG_VL === "number"
        ? row.MNTN_HG_VL
        : Number(row?.MNTN_HG_VL) || base.height || null,
    detailImage: normalizeText(row?.MNTN_INFO_IMAGE_URL, base.image || DEFAULT_IMAGE),
    regions:
      meta.regions ??
      (base.location ? [base.location] : base.regions ?? []),
    relatedIds:
      meta.relatedIds ??
      (row?.MNTN_CD_INFO ? [row.MNTN_CD_INFO] : base.relatedIds ?? []),
  };
}

function getResultInfo(wrapper) {
  const headArray = wrapper?.head;
  if (!Array.isArray(headArray)) return null;
  const resultEntry = headArray.find((entry) => entry.RESULT);
  return resultEntry?.RESULT ?? null;
}

function assertSuccess(resultInfo) {
  if (!resultInfo) return;
  const { CODE, MESSAGE } = resultInfo;
  if (CODE && CODE !== "INFO-000") {
    throw new Error(MESSAGE ? `${MESSAGE} (코드: ${CODE})` : `API 오류 코드: ${CODE}`);
  }
}

export async function fetchMountainList({
  page = 1,
  perPage = 12,
  region,
  keyword,
} = {}) {
  if (!API_KEY) {
    throw new Error("경기도 공공데이터 API 키가 설정되지 않았습니다.");
  }

  const params = buildQuery({ page, perPage, region, keyword });
  const url = `${API_BASE_URL}?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API 요청 실패: ${response.status}`);
  }

  const payload = await response.json();
  const [headInfo, rowInfo] = payload?.Mntninfostus || [];
  assertSuccess(getResultInfo(headInfo));

  const totalCount = Number(headInfo?.head?.[0]?.list_total_count) || 0;
  const rows = Array.isArray(rowInfo?.row) ? rowInfo.row : rowInfo?.row ? [rowInfo.row] : [];

  const items = rows.map((row) => normalizeRow(row));

  items.forEach((item) => {
    const cacheKey = String(item.id);
    if (!mountainListCache.has(cacheKey)) {
      mountainListCache.set(cacheKey, item);
    }
  });

  return {
    items,
    totalCount,
  };
}

export function getCachedMountainSummary(id) {
  return mountainListCache.get(String(id)) ?? null;
}

export async function fetchMountainDetail(id) {
  if (!API_KEY) {
    throw new Error("경기도 공공데이터 API 키가 설정되지 않았습니다.");
  }
  if (!id) {
    throw new Error("산 고유 ID가 필요합니다.");
  }

  const cacheKey = String(id);
  if (detailCache.has(cacheKey)) {
    return detailCache.get(cacheKey);
  }

  const perPage = 100;
  let page = 1;
  let totalPages = Infinity;

  while (page <= totalPages) {
    const params = buildQuery({ page, perPage });
    const url = `${API_BASE_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API 요청 실패: ${response.status}`);
    }

    const payload = await response.json();
    const [headInfo, rowInfo] = payload?.Mntninfostus || [];
    assertSuccess(getResultInfo(headInfo));
    const rows = Array.isArray(rowInfo?.row) ? rowInfo.row : rowInfo?.row ? [rowInfo.row] : [];

    let match = null;
    const regions = new Set();
    const relatedIds = new Set();

    rows.forEach((row) => {
      const rowId = String(row?.MNTN_CD_INFO ?? row?.MNTN_NM).trim();
      const rowName = String(row?.MNTN_NM ?? "").trim();
      if (rowId === cacheKey || rowName === cacheKey) {
        match = row;
      }
      if (rowName && match && rowName === match.MNTN_NM) {
        const region =
          extractProvinceAndCity(row?.MNTN_LOCPLC_REGION_NM) ??
          normalizeText(row?.MNTN_LOCPLC_REGION_NM);
        if (region) regions.add(region);
        if (row?.MNTN_CD_INFO) relatedIds.add(String(row.MNTN_CD_INFO));
      }
    });

    const totalCount = Number(headInfo?.head?.[0]?.list_total_count);
    if (Number.isFinite(totalCount) && totalCount > 0) {
      totalPages = Math.max(1, Math.ceil(totalCount / perPage));
    } else if (!rows.length) {
      break;
    }

    if (match) {
      const detail = normalizeDetail(match, {
        regions: Array.from(regions),
        relatedIds: Array.from(relatedIds),
      });
      detailCache.set(cacheKey, detail);
      return detail;
    }

    if (!rows.length) {
      break;
    }

    page += 1;
  }

  throw new Error("해당 산 정보를 찾을 수 없습니다.");
}
