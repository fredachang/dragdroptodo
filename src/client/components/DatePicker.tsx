interface Props {
  handleDate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dueDateWithDefault: string;
}

export function DatePicker(props: Props) {
  const { handleDate, dueDateWithDefault } = props;

  return (
    <div className="date-input">
      <input type="date" onChange={handleDate} value={dueDateWithDefault} />
    </div>
  );
}
