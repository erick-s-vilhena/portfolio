import Certificados from './Certificados';
import '../styles/Sobre.scss';

export default function CertificadosPage() {
  return (
    <div className="Sobre" id="certificados">
      <h1 className="hidden tp">Certificados</h1>
      <Certificados />
    </div>
  );
}
