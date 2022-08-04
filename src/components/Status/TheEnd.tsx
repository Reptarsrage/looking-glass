import StatusWithImage from "./StatusWithImage";
import { ReactComponent as SVG } from "../../assets/undraw_graduation_re_gthn.svg";

const TheEnd: React.FC = () => (
  <StatusWithImage message="Congratulations on reaching the end!" height={200} variant="h4" marginTop={8}>
    <SVG />
  </StatusWithImage>
);

export default TheEnd;
