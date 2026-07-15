
const CategoryCard = ({ category }) => {
  return (
    <div className="p-4 border rounded hover:shadow-md transition-shadow cursor-pointer">
      <div className="aspect-square bg-gray-200 rounded mb-2 overflow-hidden">
        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-bold">{category.name}</h3>
    </div>
  )
}

export default CategoryCard

