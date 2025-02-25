import React from 'react'

const CategoryFilter = ({ categories, selectedCategories, onCategoryChange }) => {
  return (
    <div className="mb-4">
      <h3>Filter By Category</h3>
      {categories.map(category => (
        <div key={category._id} className="form-check">
          <input 
            type="checkbox" 
            className="form-check-input" 
            id={category._id} 
            value={category.name}
            checked={selectedCategories.includes(category.name)}
            onChange={() => onCategoryChange(category.name)}
          />
          <label className="form-check-label" htmlFor={category._id}>
            {category.name}
          </label>
        </div>
      ))}
    </div>
  )
}

export default CategoryFilter