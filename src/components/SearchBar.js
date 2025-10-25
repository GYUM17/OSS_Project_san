import React from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import SortByAlphaRoundedIcon from "@mui/icons-material/SortByAlphaRounded";
import TerrainRoundedIcon from "@mui/icons-material/TerrainRounded";

const DEFAULT_REGIONS = [
  "지역선택",
  "서울시",
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "경상북도",
  "경상남도",
  "전라북도",
  "전라남도",
];

function SearchBar({
  region = "지역선택",
  keyword = "",
  sortCriterion = "dictionary",
  sortOrder = "asc",
  onRegionChange,
  onKeywordChange,
  onSearch,
  onSortCriterionChange,
  onSortOrderChange,
  regions = DEFAULT_REGIONS,
}) {
  const handleSearch = () => {
    onSearch?.();
  };

  const handleSortChange = (_, value) => {
    if (value) {
      onSortCriterionChange?.(value);
    }
  };

  const toggleOrder = () => {
    onSortOrderChange?.(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ md: "center" }}
      >
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="region-select-label">지역</InputLabel>
          <Select
            labelId="region-select-label"
            value={region}
            label="지역"
            onChange={(event) => onRegionChange?.(event.target.value)}
          >
            {regions.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          value={keyword}
          label="검색어"
          placeholder="산 이름이나 지역을 입력하세요"
          onChange={(event) => onKeywordChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSearch();
            }
          }}
        />

        <Button
          variant="contained"
          size="large"
          startIcon={<SearchRoundedIcon />}
          onClick={handleSearch}
          sx={{ px: 4, alignSelf: { xs: "stretch", md: "auto" } }}
        >
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", md: "center" }}
        mt={3}
      >
        <ToggleButtonGroup
          exclusive
          color="primary"
          value={sortCriterion}
          onChange={handleSortChange}
          size="small"
        >
          <ToggleButton value="dictionary" sx={{ gap: 1.5 }}>
            <SortByAlphaRoundedIcon fontSize="small" />
            사전순
          </ToggleButton>
          <ToggleButton value="difficulty" sx={{ gap: 1.5 }}>
            <TerrainRoundedIcon fontSize="small" />
            난이도순
          </ToggleButton>
        </ToggleButtonGroup>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title={`현재 정렬: ${sortOrder === "asc" ? "오름차순" : "내림차순"}`}>
            <IconButton color="primary" onClick={toggleOrder}>
              {sortOrder === "asc" ? (
                <ArrowUpwardRoundedIcon />
              ) : (
                <ArrowDownwardRoundedIcon />
              )}
            </IconButton>
          </Tooltip>
          <Typography variant="body2" color="text.secondary">
            {sortOrder === "asc" ? "오름차순" : "내림차순"}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export default SearchBar;
