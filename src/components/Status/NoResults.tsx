import StatusWithImage from "./StatusWithImage";
import { ReactComponent as SVG } from "../../assets/undraw_void_3ggu.svg";

const NoResults: React.FC = () => (
  <StatusWithImage message="Nothing here but an empty void">
    <SVG />
  </StatusWithImage>
);

export default NoResults;
