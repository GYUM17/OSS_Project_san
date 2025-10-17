// 카드 하나
import { useNavigate } from "react-router-dom";

export default function CardItem({ image, title, location, id}){

  const navigate = useNavigate();

  // 클릭했을 때 해당 id로 상세페이지로 이동
  const handleClick = () => {
    navigate(`/detail/${id}`);
  }

  return (
    <div className="card" onClick={handleClick}>
      <img src={image} alt={title} className="card-img" />
      <h3 className="card-title">{title}</h3>
      <p className="card-location">{location}</p>
    </div>
  );
}