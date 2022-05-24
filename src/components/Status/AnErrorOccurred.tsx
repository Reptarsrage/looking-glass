import StatusWithImage from "./StatusWithImage";
import { ReactComponent as SVG } from "../../assets/undraw_QA_engineers_dg5p.svg";

const AnErrorOccurred: React.FC = () => (
  <StatusWithImage message="Whoops... how did that slip past QA?">
    <SVG />
  </StatusWithImage>
);

export default AnErrorOccurred;
