import { TouchableOpacity, Text } from "react-native";

import { ProducerProps } from "@/app/(tabs)/catalogue";
import styles from '@/components/ProducerCatalogueCard.styles'

interface ProducerCardProps {
    item: ProducerProps;
    index: number;
    setCurrentProducer: (item: ProducerProps) => void
  }

const ProducerCatalogueCard: React.FC<ProducerCardProps> = ({ item, index, setCurrentProducer }) => {
    const handlePressProducer = (item: ProducerProps) => {
        setCurrentProducer(item)
    }
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePressProducer(item)}
      >
        <Text style={styles.textButton}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  export default ProducerCatalogueCard