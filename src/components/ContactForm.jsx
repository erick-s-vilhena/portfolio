import { useState } from "react";
import "../styles/ContactForm.scss";

const FORM_SUBMIT_ENDPOINT = "https://formsubmit.co/ajax/esv.curriculo@gmail.com";

export default function ContactForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    mensagem: "",
  });
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (status.message) {
      setStatus({ type: "", message: "" });
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(FORM_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.nome,
          email: form.email,
          message: form.mensagem,
          _subject: "Novo contato do portfolio",
          _captcha: "false",
          _template: "table",
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar a mensagem.");
      }

      setForm({
        nome: "",
        email: "",
        mensagem: "",
      });
      setStatus({
        type: "success",
        message: "Mensagem enviada com sucesso.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Nao foi possivel enviar agora. Tente novamente em instantes ou use o e-mail da pagina.",
      });
    } finally {
      setIsSubmitting(false);
    }
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

          <button
            type="submit"
            className="contact-form-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar mensagem"}
          </button>

          {status.message ? (
            <p className={`contact-form-status contact-form-status--${status.type}`}>
              {status.message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
