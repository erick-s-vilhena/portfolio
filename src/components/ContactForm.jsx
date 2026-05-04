import React, { useState } from "react";
import "../styles/ContactForm.scss";

export default function ContactForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Dados enviados:", form);
    alert("Mensagem enviada com sucesso!");

    setForm({
      nome: "",
      email: "",
      mensagem: "",
    });
  };

  return (
    <div className="contact-form-page">
      <div className="contact-form-card">
        <h3 className="contact-form-title">Entre em contato</h3>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-field">
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder=" "
              required
              className="contact-form-input"
            />
            <label htmlFor="nome" className="contact-form-label">
              Digite seu nome
            </label>
          </div>

          <div className="contact-form-field">
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="contact-form-input"
            />
            <label htmlFor="email" className="contact-form-label">
              Digite seu e-mail
            </label>
          </div>

          <div className="contact-form-field contact-form-field--textarea">
            <textarea
              id="mensagem"
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              placeholder=" "
              required
              rows={6}
              className="contact-form-textarea"
            />
            <label htmlFor="mensagem" className="contact-form-label">
              Digite sua mensagem
            </label>
          </div>

          <button type="submit" className="contact-form-button">
            Enviar mensagem
          </button>
        </form>
      </div>
    </div>
  );
}
