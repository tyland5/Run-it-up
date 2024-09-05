import { StyledText } from "../global/styledComponents";
import { View, StyleSheet } from "react-native";

export default function Explore(){

    return(
        <View style={styles.container}>
            <StyledText large bold>Feature under development</StyledText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:"#121212", 
        flex: 1, 
        width: "100%"
    }
})