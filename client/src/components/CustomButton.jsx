import { Button } from "@heroui/button";

const CustomButton = ({ children, onPress, className = "" }) => {
  return (
    <Button
      className={`bg-gradient-to-tr from-yellow-500 to-orange-400 text-white font-bold text-sm shadow-lg px-4 py-2 rounded-full focus:outline-none
        hover:from-orange-400 hover:to-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-xl ${className}`}
      onPress={onPress}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
