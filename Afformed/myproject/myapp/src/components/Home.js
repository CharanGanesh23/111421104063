import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState({
    price: { min: 0, max: Infinity },
    rating: { min: 0, max: 5 },
    company: []
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/test');
        setProducts(res.data);
        setFilteredProducts(res.data); 
      } catch (err) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const { min: minPrice, max: maxPrice } = filter.price;
      const { min: minRating, max: maxRating } = filter.rating;
      const { company } = filter;

      const filtered = products.filter(product => {
        const isPriceValid = product.price >= minPrice && product.price <= maxPrice;
        const isRatingValid = product.rating >= minRating && product.rating <= maxRating;
        const isCompanyValid = company.length === 0 || company.includes(product.company);

        return isPriceValid && isRatingValid && isCompanyValid;
      });

      setFilteredProducts(filtered);
    };

    applyFilters();
  }, [filter, products]);

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;

    if (name === 'company') {
      setFilter(prevFilter => ({
        ...prevFilter,
        company: checked
          ? [...prevFilter.company, value]
          : prevFilter.company.filter(c => c !== value)
      }));
    } else {
      setFilter(prevFilter => ({
        ...prevFilter,
        [name]: {
          ...prevFilter[name],
          [event.target.dataset.key]: parseFloat(value)
        }
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="App">
      <h1>Product List</h1>
      <div className="filter-section">
        <h2>Filters</h2>
        <div className="filter-group">
          <h3>Price Range</h3>
          <label>
            Min Price:
            <input
              type="number"
              name="price"
              data-key="min"
              value={filter.price.min}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            Max Price:
            <input
              type="number"
              name="price"
              data-key="max"
              value={filter.price.max}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <div className="filter-group">
          <h3>Rating Range</h3>
          <label>
            Min Rating:
            <input
              type="number"
              name="rating"
              data-key="min"
              step="0.1"
              value={filter.rating.min}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            Max Rating:
            <input
              type="number"
              name="rating"
              data-key="max"
              step="0.1"
              value={filter.rating.max}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <div className="filter-group">
          <h3>Company</h3>
          {['AMZ', 'FLP', 'SNP', 'MYN', 'AZO'].map(company => (
            <label key={company}>
              <input
                type="checkbox"
                name="company"
                value={company}
                checked={filter.company.includes(company)}
                onChange={handleCheckboxChange}
              />
              {company}
            </label>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.productName} className="product-card">
            <h2>{product.productName}</h2>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Rating:</strong> {product.rating}</p>
            <p><strong>Discount:</strong> {product.discount}%</p>
            <p><strong>Availability:</strong> {product.availability}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;