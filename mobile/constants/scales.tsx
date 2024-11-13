import { Dimensions } from "react-native";

const guidelineBaseHeight = 855.6;
const guidelineBaseWidth = 432;

const useScale = () => {
    const { height, width } = Dimensions.get("window")

    const horizontalScale = (size: number) => (width / guidelineBaseWidth) * size;
    const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;

    return { horizontalScale, verticalScale };
};

export default useScale;