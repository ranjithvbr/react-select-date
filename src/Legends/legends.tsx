import * as React from "react";
import { useMemo } from 'react';
import "./legends.scss";

type legendsParameterProps = {
  singleSlotState: boolean,
  duelSlotState: boolean,
  templateClr: string,
}

/**
 * @param {*} props all the props needed for show the slotInfo
 * @returns {boolean} return slotInfo
 */
function Legends({ singleSlotState, duelSlotState, templateClr }: legendsParameterProps) {
  const templateSelectedClr = useMemo(() => {
    return templateClr === "blue" ? "cld_slotInfoSelectedBlueClr" : "cld_slotInfoSelectedGreenClr";
  }, [templateClr]);
  return (
    <div className="cld_slotContainer">
      <div className="cld_slot">
        <p className={`${templateSelectedClr} cld_slotInfoSize`} />
        <span className="cld_slotInfoLabel">Selected Date</span>
      </div>
      <div className="cld_slot">
        <p className="cld_slotInfoSize cld_slotInfoDisabledClr" />
        <span className="cld_slotInfoLabel">Disabled Date</span>
      </div>
      {(singleSlotState || duelSlotState) && (
        <div className="cld_slot">
          <p className="cld_slotInfoSize cld_slotInfoAvailableClr" />
          <span className="cld_slotInfoLabel">Available Slots</span>
        </div>
      )}
      {duelSlotState && (
        <div className="cld_slot">
          <p className="cld_slotInfoSize cld_slotInfoTotalClr" />
          <span className="cld_slotInfoLabel">Total Slots</span>
        </div>
      )}
    </div>
  );
}

export default Legends;
