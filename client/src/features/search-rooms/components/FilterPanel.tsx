import PanelFrame from "@/components/ui/panel-frame";
import FilterPanelBody from "./FilterPanelBody";

export default function FilterPanel() {
  return (
    <PanelFrame as="aside" variant="sidebar">
      <FilterPanelBody />
    </PanelFrame>
  );
}
