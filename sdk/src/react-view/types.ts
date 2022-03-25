import { PlainData, Position } from "@pagenote/shared/lib/@types/data";
import { Brush } from "@pagenote/shared/lib/pagenote-brush";
import { Action } from "@pagenote/shared/lib/pagenote-actions/@types";

export interface PageNoteProps {
  brushes: Brush[],
  actions: Action[],
  beforeRecord: () => boolean,
}

export interface Runtime {
  startPosition?: Position,
  lastPosition?: Position
  lastEvent?: Event
  lastKeydownTime?: number
  isPressing?: boolean,
}