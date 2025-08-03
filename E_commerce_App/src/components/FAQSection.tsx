// FAQSection.tsx
import React, { useState } from "react";
import "./../styles/FAQSection.css";

const faqs = [
  {
    question: "How long does it take to get approved?",
    answer: "Usually within 2-3 business days after submitting your application.",
  },
  {
    question: "What are the fees for selling?",
    answer: "We charge a competitive commission fee based on your product category.",
  },
  {
    question: "Can I sell internationally?",
    answer: "Currently, our platform supports sellers within Nepal only.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <h3>Frequently Asked Questions</h3>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${openIndex === i ? "open" : ""}`}
            onClick={() => toggleFAQ(i)}
          >
            <div className="faq-question">{faq.question}</div>
            {openIndex === i && <div className="faq-answer">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
