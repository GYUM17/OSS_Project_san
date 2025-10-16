// 카드 하나

export default function CardItem({ image, title, location}){
  return (
    <div className="card">
      <img src={image} alt={title} className="card-img" />
      <h3 className="card-title">{title}</h3>
      <p className="card-location">{location}</p>
    </div>
  );
}