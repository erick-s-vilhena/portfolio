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
        <h2 className="contact-form-title">Contato</h2>
        <p className="contact-form-subtitle">
          Preencha o formulário abaixo para entrar em contato.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="contact-form-field">
            <label htmlFor="nome" className="contact-form-label">
              Nome
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Digite seu nome"
              required
              className="contact-form-input"
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="email" className="contact-form-label">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Digite seu e-mail"
              required
              className="contact-form-input"
            />
          </div>

          <div className="contact-form-field">
            <label htmlFor="mensagem" className="contact-form-label">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              placeholder="Digite sua mensagem"
              required
              rows={6}
              className="contact-form-textarea"
            />
          </div>

          <button type="submit" className="contact-form-button">
            Enviar mensagem
          </button>
        </form>
      </div>
    </div>
  );
}