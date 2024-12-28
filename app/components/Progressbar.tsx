interface ProgressbarProps {
  current: number;
  total: number;
}

const Progressbar = ({ current, total }: ProgressbarProps) => {
  // Calculate percentage, ensuring it doesn't exceed 100
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className="w-full bg-gray-200 rounded-[13px] h-[17px]">
      <div
        className="bg-dark-400 h-[17px] rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progressbar;
