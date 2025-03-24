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
    <Container className="mt-5" style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "10px" }}>
      <Card className="p-4 shadow" style={{ backgroundColor: "#ffffff" }}>
        <h1 className="text-center">Terms and Conditions for Vendors on ValueKart</h1>
        <p className="text-center text-muted">Last updated: March 25, 2025</p>

        <h2 className="mt-4">1. Introduction</h2>
        <p>
          Welcome to ValueKart, a delivery-based platform. These Terms and Conditions outline the rules and
          responsibilities of vendors who list their products on our platform. By registering and uploading
          products on ValueKart, you agree to comply with these terms.
        </p>

        <h2 className="mt-4">2. Product Quality and Returns</h2>
        <p>
          Vendors must ensure that all products listed are genuine, original, and not counterfeit or copied.
          If a product is found to be damaged before reaching the customer, the vendor must accept the return
          and replace the product or issue a refund as per our return policy.
          Vendors must comply with all types of return policies set by ValueKart, including customer-initiated
          returns due to defects, damages, or dissatisfaction.
        </p>

        <h2 className="mt-4">3. Payment Terms</h2>
        <p>
          Payments for products sold through ValueKart will be processed within 7 days after successful delivery
          to the customer. Payments will be made via cash or credited directly to the vendor’s registered account.
        </p>

        <h2 className="mt-4">4. Pricing and Stock Updates</h2>
        <p>
          Vendors must update product prices and stock availability immediately if there are any changes.
          If a vendor fails to update a product’s price and a customer orders it at the previously listed price,
          the vendor is obligated to fulfill the order at that price, regardless of whether the new price is higher
          or lower.
        </p>

        <h2 className="mt-4">5. Product Authenticity and Compliance</h2>
        <p>
          Vendors must ensure that all products comply with local laws, regulations, and quality standards.
          Any duplicate or copied products will lead to immediate removal from the platform and possible termination
          of the vendor’s account.
        </p>

        <h2 className="mt-4">6. Amendments and Updates</h2>
        <p>
          ValueKart reserves the right to modify these terms at any time. Vendors will be notified of any changes,
          and continued use of the platform constitutes acceptance of the updated terms.
        </p>

        <h2 className="mt-4">7. Vendor Responsibilities</h2>
        <p>
          Vendors must provide accurate and updated product descriptions, pricing, and stock details.
          Vendors should maintain clear communication with ValueKart regarding order processing, delivery, and returns.
        </p>

        <h2 className="mt-4">8. Termination and Penalties</h2>
        <p>
          Non-compliance with these terms may result in penalties, product removal, or termination of the vendor’s account.
        </p>

        <p className="mt-4">
          By uploading products on ValueKart, vendors acknowledge that they have read, understood, and agreed to these
          Terms and Conditions.
        </p>

        <h2 className="mt-4">9. Contact Information</h2>
        <p>
          For any queries, contact our Vendor Support Team at <a href="mailto:support@valuekart.com">support@valuekart.com</a>.
        </p>

        <Form onSubmit={handleSubmit} className="mt-4 text-center">
          <Form.Check 
            type="checkbox" 
            label="I agree to the Terms and Conditions" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <Button variant="primary" type="submit" className="mt-3">Submit</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default TermsAndConditions;
