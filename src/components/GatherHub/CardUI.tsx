import CardUIClient from "./CardUIClient";
import { CardUIProps } from "@/lib/gatherHub";

const CardUI = (props: CardUIProps) => {
  return <CardUIClient {...props} />;
};

export default CardUI;