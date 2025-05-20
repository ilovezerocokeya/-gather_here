import { CardModalProps } from "@/lib/gatherHub";
import CardModalClient from "./CardModalClient";

const CardModalServer = (props: CardModalProps) => {
  return <CardModalClient {...props} />;
};

export default CardModalServer;