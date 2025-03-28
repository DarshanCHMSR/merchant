import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agreed) {
      alert("You have agreed to the Terms and Conditions.");
      navigate("/dashboard/merchant");
    } else {
      alert("Please agree to the Terms and Conditions before submitting.");
    }
  };

  return (
    <Container className="terms-container">
      <Card className="terms-card">
        <h1 className="terms-title">Terms and Conditions for Vendors on ValueKart</h1>
        <p className="terms-update-date">Last updated: March 25, 2025</p>

        <div className="terms-content">
          <h2 className="terms-section-title">1. Introduction</h2>
          <p className="terms-text">
            Welcome to ValueKart, a delivery-based platform. These Terms and Conditions outline the rules and
            responsibilities of vendors who list their products on our platform. By registering and uploading
            products on ValueKart, you agree to comply with these terms.
          </p>

          <h2 className="terms-section-title">2. Product Quality and Returns</h2>
          <p className="terms-text">
            Vendors must ensure that all products listed are genuine, original, and not counterfeit or copied.
            If a product is found to be damaged before reaching the customer, the vendor must accept the return
            and replace the product or issue a refund as per our return policy.
            Vendors must comply with all types of return policies set by ValueKart, including customer-initiated
            returns due to defects, damages, or dissatisfaction.
          </p>

          <h2 className="terms-section-title">3. Payment Terms</h2>
          <p className="terms-text">
            Payments for products sold through ValueKart will be processed within 7 days after successful delivery
            to the customer. Payments will be made via cash or credited directly to the vendor's registered account.
          </p>

          <h2 className="terms-section-title">4. Pricing and Stock Updates</h2>
          <p className="terms-text">
            Vendors must update product prices and stock availability immediately if there are any changes.
            If a vendor fails to update a product's price and a customer orders it at the previously listed price,
            the vendor is obligated to fulfill the order at that price, regardless of whether the new price is higher
            or lower.
          </p>

          <h2 className="terms-section-title">5. Product Authenticity and Compliance</h2>
          <p className="terms-text">
            Vendors must ensure that all products comply with local laws, regulations, and quality standards.
            Any duplicate or copied products will lead to immediate removal from the platform and possible termination
            of the vendor's account.
          </p>

          <h2 className="terms-section-title">6. Amendments and Updates</h2>
          <p className="terms-text">
            ValueKart reserves the right to modify these terms at any time. Vendors will be notified of any changes,
            and continued use of the platform constitutes acceptance of the updated terms.
          </p>

          <h2 className="terms-section-title">7. Vendor Responsibilities</h2>
          <p className="terms-text">
            Vendors must provide accurate and updated product descriptions, pricing, and stock details.
            Vendors should maintain clear communication with ValueKart regarding order processing, delivery, and returns.
          </p>

          <h2 className="terms-section-title">8. Termination and Penalties</h2>
          <p className="terms-text">
            Non-compliance with these terms may result in penalties, product removal, or termination of the vendor's account.
          </p>

          <p className="terms-text terms-acknowledgement">
            By uploading products on ValueKart, vendors acknowledge that they have read, understood, and agreed to these
            Terms and Conditions.
          </p>

          <h2 className="terms-section-title">9. Contact Information</h2>
          <p className="terms-text">
            For any queries, contact our Vendor Support Team at <a href="mailto:support@valuekart.com" className="terms-link">support@valuekart.com</a>.
          </p>
        </div>

        <Form onSubmit={handleSubmit} className="terms-form">
          <Form.Check 
            type="checkbox" 
            label="I agree to the Terms and Conditions" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="terms-checkbox"
          />
          <Button variant="primary" type="submit" className="terms-submit-btn">Submit</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default TermsAndConditions;

// CSS Styles
const styles = `
  .terms-container {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
  }

  .terms-card {
    border: none;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 40px;
    background-color: #ffffff;
  }

  .terms-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 10px;
    text-align: center;
    line-height: 1.3;
  }

  .terms-update-date {
    font-size: 0.9rem;
    color: #7f8c8d;
    text-align: center;
    margin-bottom: 40px;
  }

  .terms-content {
    margin-bottom: 30px;
  }

  .terms-section-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #3498db;
    margin-top: 25px;
    margin-bottom: 15px;
  }

  .terms-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #34495e;
    margin-bottom: 15px;
  }

  .terms-acknowledgement {
    font-weight: 500;
    margin-top: 30px;
    padding: 15px;
    background-color: #f8f9fa;
    border-left: 4px solid #3498db;
  }

  .terms-link {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
  }

  .terms-link:hover {
    text-decoration: underline;
  }

  .terms-form {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid #ecf0f1;
  }

  .terms-checkbox {
    margin-bottom: 25px;
  }

  .terms-checkbox .form-check-input {
    margin-right: 10px;
  }

  .terms-checkbox .form-check-label {
    font-weight: 500;
    color: #2c3e50;
  }

  .terms-submit-btn {
    padding: 10px 30px;
    font-weight: 600;
    border-radius: 5px;
    background-color: #3498db;
    border: none;
    transition: all 0.3s ease;
  }

  .terms-submit-btn:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .terms-card {
      padding: 25px;
    }
    
    .terms-title {
      font-size: 1.8rem;
    }
    
    .terms-section-title {
      font-size: 1.2rem;
    }
  }
`;

// Add styles to the document
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);