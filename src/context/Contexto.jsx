import { createContext, useContext, useState } from "react";

const Contexto = createContext();

// PROVIDER
export function CertificadoProvider({ children }) {
  const [certificadoAberto, setCertificadoAberto] = useState(null);
  const [codigo, setCodigo] = useState(null);

  const [habilidadeOpen, setHabilidadeOpen] = useState(null);

  return (
    <Contexto.Provider
      value={{
        certificadoAberto,
        setCertificadoAberto,
        codigo,
        setCodigo,
        habilidadeOpen, 
        setHabilidadeOpen
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

// HOOK PERSONALIZADO
export function useContexto() {
  return useContext(Contexto);
}
