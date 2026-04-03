import React, { useState } from "react";

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
    <div style={styles.page}>
      <style>{`
        * {
          box-sizing: border-box;
        }
        input, textarea, button {
          font: inherit;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255,255,255,0.42);
        }
      `}</style>

      <div style={styles.card}>
        <h2 style={styles.title}>Contato</h2>
        <p style={styles.subtitle}>
          Preencha o formulário abaixo para entrar em contato.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label htmlFor="nome" style={styles.label}>
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
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
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
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="mensagem" style={styles.label}>
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
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button}>
            Enviar mensagem
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    justifyContent: 'left',
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    background: "var(--cor-bk)",
    border: "2px solid rgba(127, 90, 240, 0.35)",
    borderRadius: "18px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    padding: "28px",
  },
  title: {
    margin: "0 0 8px",
    color: "var(--cor-titulo)",
    fontSize: "32px",
    fontWeight: 800,
  },
  subtitle: {
    margin: "0 0 24px",
    color: "var(--cor-texto)",
    fontSize: "15px",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "var(--cor-titulo)",
    fontSize: "14px",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    height: "48px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "var(--cor-menu)",
    color: "var(--cor-texto)",
    padding: "0 14px",
    outline: "none",
  },
  textarea: {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "var(--cor-menu)",
    color: "var(--cor-texto)",
    padding: "14px",
    outline: "none",
    resize: "vertical",
    minHeight: "140px",
  },
  button: {
    marginTop: "6px",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background: "#7F5AF0",
    color: "#fffffe",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
  },
};