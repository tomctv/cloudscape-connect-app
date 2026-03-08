import { Header } from "@cloudscape-design/components";

interface TableHeaderProps {
  totalItemsCount: number | undefined;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  totalItemsCount,
}) => {
  return (
    <Header counter={totalItemsCount !== undefined && `(${totalItemsCount})`}>
      Contact history
    </Header>
  );
};
