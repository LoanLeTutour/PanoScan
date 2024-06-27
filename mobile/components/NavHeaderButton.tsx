import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import Colors from "@/constants/Colors";

const NavHeaderButton = (icon: string) => {
    const router = useRouter();
    const toggleTab = () => {
        if (icon !== 'images'){
            router.replace('/(tabs)/photo');
        } else {
            router.replace('/(tabs)/history');
        }
   
    }
    return (
        <TouchableOpacity onPress={toggleTab}>
            <Ionicons name={icon} color={Colors.primary} size={30}  style={{marginHorizontal: 20}}/>
        </TouchableOpacity>
    )
};

export default NavHeaderButton;