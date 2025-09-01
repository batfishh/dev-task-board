import { Button } from "@/components/ui/button";
import { boardStyles } from "./board.styles";

export default function Board() {
  return (
    <div style={boardStyles.board}>
      <div style={boardStyles.buttonContainer}>
        <Button buttonType="AddPostit" />
        <Button buttonType="SketchMode" />
        <Button buttonType="Save" />
      </div>
    </div>
  );
}
