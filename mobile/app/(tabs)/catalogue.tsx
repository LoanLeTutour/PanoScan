import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalSearchParams } from "expo-router";

import styles from "../(tabs)styles/catalogue.styles";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "@/components/WaitingPage";
import DecorCatalogueCard from "@/components/DecorCatalogueCard";
import ProducerCatalogueCard from "@/components/ProducerCatalogueCard";
import StructureCatalogueCard from "@/components/StructureCatalogueCard";
import HeaderCatalogue from "@/components/HeaderCatalogue";
import ProductTypeCatalogueCard from "@/components/ProductTypeCatalogueCard";


export interface ProducerProps {
  id: string;
  name: string;
}

export interface CollectionProps {
  id: string;
  name: string;
  market_id: string;
  producer: ProducerProps;
}

export interface DecorProps {
  id: string;
  name: string;
  code: string;
  photo_url: string;
}

export interface DecorCollectionProps {
  id: string,
  collection: CollectionProps,
  decor: DecorProps
}

export interface StructureProps {
  id: string,
  name: string,
  code: string,
  photo_url: string,
  producer: ProducerProps
}


export interface StructureDecorProps {
  id: string,
  decor_collection: DecorCollectionProps,
  structure: StructureProps
}

export interface ProductTypeProps {
  id: string,
  name: string,
  photo_url: string,
}

interface PredictionParams {
  producer_prediction_id?: string,
  decor_collection_prediction_id?: string
}



const Catalogue = () => {
  const {
    loading,
    setLoading,
    marketId,
    userId,
    accessToken,
    api
  } = useAuth();

  const [producers, setProducers] = useState<ProducerProps[]>([]);
  const [producerSelected, setProducerSelected] = useState<ProducerProps>();
  const [decors, setDecors] = useState<DecorCollectionProps[]>([]);
  const [decorSelected, setDecorSelected] = useState<DecorCollectionProps>();
  const [filteredDecors, setFilteredDecors] = useState<DecorCollectionProps[]>([]);
  const [structures, setStructures] = useState<StructureDecorProps[]>([])
  const [structureSelected, setStructureSelected] = useState<StructureDecorProps>()
  const [filteredStructures, setFilteredStructures] = useState<StructureDecorProps[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeProps[]>([])

  const prediction_params = useGlobalSearchParams() as PredictionParams

  const [producerPredictionId, setProducerPredictionId] = useState<string>('');
  const [decorCollectionPredictionId, setDecorCollectionPredictionId] = useState<string>('');

  useEffect(() => {
    // Initialiser les états locaux avec les paramètres de prédiction
      if (prediction_params?.producer_prediction_id) {
        console.log(prediction_params?.producer_prediction_id)
        setProducerPredictionId(prediction_params.producer_prediction_id);
      }
      if (prediction_params?.decor_collection_prediction_id) {
        console.log(prediction_params?.decor_collection_prediction_id)
        setDecorCollectionPredictionId(prediction_params.decor_collection_prediction_id);
      }
      setStructureSelected(undefined)
    
  }, [prediction_params]);

  useEffect(() => {
    if (producers.length && producerPredictionId) {
      const producer = producers.find(producer => Number(producer.id) === Number(producerPredictionId));
      if (producer) {
        setProducerSelected(producer);
        setProducerPredictionId('');}
    }
  }, [producerPredictionId, producers]);
  
  useEffect(() => {
    if (decors.length && decorCollectionPredictionId) {
      const decor = decors.find(decor => Number(decor.id) === Number(decorCollectionPredictionId));
      if (decor) {
        setDecorSelected(decor);
        setDecorCollectionPredictionId('')}
    }
  }, [decorCollectionPredictionId, decors]);


  //////Différents fetch data :
  // Arrivé sur cette page, les fabricants présents sur le marché du client sont appelés
  const fetchProducers = async () => {
    try {
      setLoading(true);
      const response = await api.get<ProducerProps[]>(
        `user/${userId}/producers/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            market_id: marketId,
          },
        }
      );
      if (response.data) {
        setProducers(response.data);
      }
    } catch (err: any) {
      console.error("Error fetching producers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducers();
  }, []);

  // Lorsque le fabricant est choisie, les décors associés à ce fabricant sont appelés

  const fetchDecors = async () => {
    try{
      setLoading(true)
      if (!producerSelected) {
        return;
      }
      const response = await api.get<DecorCollectionProps[]>(
        `user/${userId}/decors/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            producer_id: producerSelected?.id,
            market_id: marketId
          },
        }
      );
      if (response.data) {
        setDecors(response.data);
        setFilteredDecors(response.data);
      }


    }catch(err:any){
      console.error("Error fetching decors:", err);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() =>{
    fetchDecors()
  }, [producerSelected])

  // Lorque le décor est choisie, les structures proposées par le fabricant dans ce décor sont appelées


  const fetchStructures = async () => {
    try{
      setLoading(true)
      if (!decorSelected) {
        return;
      }
      const response = await api.get<StructureDecorProps[]>(
        `user/${userId}/structures/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            decor_id: decorSelected.decor.id,
            collection_id: decorSelected.collection.id
          },
        }
      );
      console.log("Résultat du call API fetchStructures:", response.data);
      if (response.data) {
        setStructures(response.data);
        setFilteredStructures(response.data);
      }


    }catch(err:any){
      console.error("Error fetching structures:", err);

    }finally{
      setLoading(false)
    }
  }

  useEffect(() =>{
    fetchStructures()
  }, [decorSelected])

  // Lorque la combinaison décor/structure est choisie, les types de produits proposés sont appelées

  const fetchProductTypes = async () => {
    try{
      setLoading(true)
      if (!structureSelected) {
        return;
      }
      const response = await api.get<ProductTypeProps[]>(
        `user/${userId}/product_types/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            structure_id: structureSelected?.id
          },
        }
      );
      console.log(structureSelected)
      console.log("Résultat du call API fetchProductTypes:", response.data);
      if (response.data) {
        setProductTypes(response.data);
      }


    }catch(err:any){
      console.error("Error fetching product types:", err);

    }finally{
      setLoading(false)
    }
  }

  useEffect(() =>{
    fetchProductTypes()
  }, [structureSelected])



  ///// Mise à jour des états quand les boutons retours sont utilisés

  const handleBackToProducerList = () => {
    setProducerSelected(undefined);
    setDecors([])
    setFilteredDecors([])
    console.log("Back to producer list")
  };

  const handleBackToDecorList = () => {
    setDecorSelected(undefined);
    setStructures([])
    setFilteredStructures([])
    console.log("Back to decor list")
  };

  const handleBackToStructureList = () => {
    setStructureSelected(undefined);
    setProductTypes([])
    console.log("Back to structure list")
    console.log(productTypes)
  };


  /////// Filtres de recherches pour les pages DecorList et Structure List


  const filterDecors = (text: string) => {
    const newDecors = decors.filter(item =>
      item.decor.code.includes(text)
    )
    setFilteredDecors(newDecors)
  }

  const filterStructures = (text: string) => {
    const newStructures = structures.filter(item =>
      item.structure.code.includes(text)
    )
    setFilteredStructures(newStructures)
  }

//////// Création de la liste des fabricants 
  const ProducerListPage = () => {
    return(
          <FlatList
            data={producers}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            renderItem={({ item, index }) => (
              <ProducerCatalogueCard item={item} index={index} setCurrentProducer={receiveCurrentProducer}/>
            )}
          />

    )
  }
  ////Lorsqu'un fabricant est choisie, l'état est mis à jour
  const receiveCurrentProducer = (item: ProducerProps) => {
    setProducerSelected(item)
  }

  //////// Création de la liste des décors

  const DecorListPage = () => {
    return(
          <FlatList
            data={filteredDecors}
            keyExtractor={(item) => item.decor.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            maxToRenderPerBatch={3}
            renderItem={({ item, index }) => (
              <DecorCatalogueCard item={item} index={index} setCurrentDecor={receiveCurrentDecor}/>
            )}
          />
)
  }
  ////Lorsqu'un décor est choisie, l'état est mis à jour
  const receiveCurrentDecor = (item: DecorCollectionProps) => {
    setDecorSelected(item)
  }

  //////// Création de la liste des structures

  const StructureListPage = () => {
    return(
          <FlatList
            data={filteredStructures}
            keyExtractor={(item) => item.structure.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            maxToRenderPerBatch={3}
            renderItem={({ item, index }) => (
              <StructureCatalogueCard item={item} index={index} setCurrentStructure={receiveCurrentStructure} />
            )}
          />
)
  }
  ////Lorsqu'une structure est choisie, l'état est mis à jour
  const receiveCurrentStructure = (item: StructureDecorProps) => {
    setStructureSelected(item)
  }

  //////// Création de la liste des types de produits

  const ProductTypeListPage = () => {
    return(

          <FlatList
            data={productTypes}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
            maxToRenderPerBatch={3}
            renderItem={({ item, index }) => (
              <ProductTypeCatalogueCard item={item} index={index} structure_id={structureSelected?.id}/>
            )}
          />
    )
  }




  return loading ? (
    <LoadingSpinner />
  ) : (
    <SafeAreaView style={styles.background}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Catalogue</Text>
      </View>
      <HeaderCatalogue
      producerSelected={producerSelected}
      decorSelected={decorSelected}
      structureSelected={structureSelected}
      filterDecors={filterDecors}
      filterStructures={filterStructures}
      backButtonToProducerListPressed={handleBackToProducerList}
      backButtonToDecorListPressed={handleBackToDecorList}
      backButtonToStructureListPressed={handleBackToStructureList}
      />
      {!producerSelected ? 
      (
        <ProducerListPage/>
      ) : 
      !decorSelected ?
      (
        <DecorListPage/>
      ) :
      !structureSelected ?
      (
        <StructureListPage/>
      ) :
      (
        <ProductTypeListPage/>
      )
      }
    </SafeAreaView>
  );
};

export default Catalogue;
