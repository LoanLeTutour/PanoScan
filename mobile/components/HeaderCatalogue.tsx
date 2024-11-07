import { View, TouchableOpacity, Text, TextInput } from "react-native"
import React, {useState} from "react"
import { Ionicons } from "@expo/vector-icons"

import { Colors } from "@/constants/Colors"
import { ProducerProps, DecorCollectionProps, StructureDecorProps } from "@/app/(tabs)/catalogue"
import styles from "./HeaderCatalogue.styles"

export interface BackButtonElementProps {
  handleFunction: () => void;
}

const BackButtonElement: React.FC<BackButtonElementProps> = ({ handleFunction }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={handleFunction}>
      <Ionicons name="arrow-undo" size={40} color={Colors.secondary} />
    </TouchableOpacity>
  );
};


interface HeaderProps {
    producerSelected: ProducerProps | undefined ,
    decorSelected: DecorCollectionProps | undefined,
    structureSelected: StructureDecorProps | undefined,
    filterDecors: (text: string) => void,
    filterStructures: (text: string) => void
    backButtonToStructureListPressed: () => void,
    backButtonToDecorListPressed: () => void,
    backButtonToProducerListPressed: () => void

}



const HeaderCatalogue: React.FC<HeaderProps>  = ({
  producerSelected, 
  decorSelected, 
  structureSelected, 
  filterDecors,
  filterStructures,
  backButtonToStructureListPressed,
  backButtonToDecorListPressed,
  backButtonToProducerListPressed
}) => {

  const [decorSearchInput, setDecorSearchInput] = useState<string>('')
  const [structureSearchInput, setStructureSearchInput] = useState<string>('')

  const handleBackToStructureList = () => {
    backButtonToStructureListPressed()
  }
  const handleBackToDecorList = () => {
    backButtonToDecorListPressed()
  }
  const handleBackToProducerList = () => {
    backButtonToProducerListPressed()
  }
  const BackButton = () => {
    return(
            structureSelected ?
            <BackButtonElement handleFunction={handleBackToStructureList}/>
            :
            decorSelected ?
            <BackButtonElement handleFunction={handleBackToDecorList}/>
            :
            producerSelected ?
            <BackButtonElement handleFunction={handleBackToProducerList}/>
            :
            null)
  }
  const TitleList = () => {
    return(

            structureSelected ?
            (<Text style={styles.subTitle}>Liste des types de produits en stock usine pour le {decorSelected?.decor.code.replace(' ', '-')}-{structureSelected?.structure.code}</Text>)
            :
            decorSelected ?
            (<Text style={styles.subTitle}>Liste des structures en stock usine pour le décor {decorSelected?.decor.code.replace(' ', '-')}</Text>)
            :
            producerSelected ?
            (<Text style={styles.subTitle}>Liste des décors {producerSelected?.name}</Text>)
            :
            (<Text style={styles.subTitle}>Choix du fabricant</Text>)
    )
  }

  const handleTextDecorInput = (text: string) => {
    const modified_text = text.toUpperCase()
    setDecorSearchInput(modified_text)
    filterDecors(modified_text)
  }

  const handleTextStructureInput = (text: string) => {
    const modified_text = text.toUpperCase()
    setStructureSearchInput(modified_text)
    filterStructures(modified_text)
  }
    return(
      <View style={styles.headerContainer}>
        <BackButton/>
        <View style={styles.subTitleContainer}>
        <TitleList/>
        {
          (producerSelected && !decorSelected) ?
          <TextInput
          maxLength={10}
          value={decorSearchInput}
          onChangeText={handleTextDecorInput}
          placeholder="Chercher un code décor (Exemple: K 101)"
          textAlign="center"
          />
          :
          (decorSelected && !structureSelected) ?
          <TextInput
          maxLength={10}
          value={structureSearchInput}
          onChangeText={handleTextStructureInput}
          placeholder="Chercher un code structure (Exemple: PE)"
          textAlign="center"
          />
          :
          null
        }
        </View>
        
        
      </View>
    )
  }


  export default HeaderCatalogue