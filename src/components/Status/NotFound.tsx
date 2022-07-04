import StatusWithImage from "./StatusWithImage";
import { ReactComponent as SVG } from "../../assets/undraw_lost_re_xqjt.svg";

const NotFound: React.FC = () => (
  <StatusWithImage message="I knew we should've taken that left turn at Albuquerque!">
    <SVG />
  </StatusWithImage>
);

export default NotFound;
