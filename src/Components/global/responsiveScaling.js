import { Dimensions } from 'react-native';


// cited: https://medium.com/simform-engineering/create-responsive-design-in-react-native-f84522a44365
const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size, factor = 0.0) => (height / guidelineBaseHeight) * size + Math.min(0, guidelineBaseHeight - height) * factor; // optionally control scaling when bigger than guideline 
const moderateScale = (size, factor = 0.5) => Math.floor( size + (horizontalScale(size) - size) * factor );

export {horizontalScale as hs, verticalScale as vs, moderateScale as ms}
