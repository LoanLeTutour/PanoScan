import {
  TouchableOpacity,
  Text,
  View,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { ProductTypeProps } from "@/app/(tabs)/catalogue";
import styles from "@/components/ProductTypeCatalogueCard.styles";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/app/context/AuthContext";
import { StructureDecorProps } from "@/app/(tabs)/catalogue";
import LoadingSpinner from "./WaitingPage";

interface ProductTypeCardProps {
  item: ProductTypeProps;
  index: number;
  structure_id: string | undefined;
}

interface FormatProductProps {
  length_in_mm: number;
  width_in_mm: number;
}

interface FinalProductsProps {
  id: string;
  product_type: ProductTypeProps;
  structure_decor_collection: StructureDecorProps;
  format: FormatProductProps;
  thickness_in_mm: number;
}

interface APIResponseProps {
  distinct_formats: FormatProductProps[];
  distinct_thicknesses: number[];
  final_products: FinalProductsProps[];
}

const ProductTypeCatalogueCard: React.FC<ProductTypeCardProps> = ({
  item,
  index,
  structure_id,
}) => {
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [productTypeSelected, setProductTypeSelected] =
    useState<ProductTypeProps>();
  const [finalProducts, setFinalProducts] = useState<FinalProductsProps[]>([]);
  const [formats, setFormats] = useState<FormatProductProps[]>([]);
  const [thicknesses, setThicknesses] = useState<number[]>([]);
  const [gridMatrix, setGridMatrix] = useState<boolean[][]>([]);
  const {
    userId,
    accessToken,
    api,
    loading,
    setLoading
  } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handlePressProductType = (item: ProductTypeProps) => {
    setProductTypeSelected(item);
    console.log("product type selected");
  };

  const correctPhotoSource = (url: string) => {
    const idUrl = url.slice(32, -17);
    return `https://drive.google.com/uc?export=view&id=${idUrl}`;
  };

  // Lorque le type de produit est choisi, les produits finaux proposés sont appelées

  const fetchFinalProducts = async () => {
    try {
      if (!productTypeSelected) {
        return;
      }
      const response = await api.get<APIResponseProps>(
        `user/${userId}/final_products/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            structure_id: structure_id,
            product_type_id: productTypeSelected?.id,
          },
        }
      );
      if (response.data) {
        setFinalProducts(response.data.final_products ?? []);
        setFormats(response.data.distinct_formats ?? []);
        setThicknesses(response.data.distinct_thicknesses ?? []);
        const matrix = updateGridMatrix(response.data);
        setGridMatrix(matrix);
      }
    } catch (err: any) {
    }
  };

  useEffect(() => {
    console.log("effect triggered");
    fetchFinalProducts();
  }, [productTypeSelected]);

  useEffect(() => {
    console.log("finalProducts changed: ", finalProducts);
  }, [finalProducts]);

  useEffect(() => {
    console.log("formats changed: ", formats);
  }, [formats]);

  useEffect(() => {
    console.log("thicknessess changed: ", thicknesses);
  }, [thicknesses]);

  useEffect(() => {
    console.log("gridMatrix changed: ", gridMatrix);
    if (gridMatrix) {
      setModalVisible(true);
    }
  }, [gridMatrix]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setProductTypeSelected(undefined);
    setFinalProducts([]);
    setFormats([]);
    setThicknesses([]);
    setGridMatrix([]);
  };

  const updateGridMatrix = (data: APIResponseProps) => {
    console.log("Updating grid matrix");
    if (
      !data?.distinct_thicknesses?.length ||
      !data?.distinct_formats?.length
    ) {
      console.warn("Grid matrix data is incomplete.");
      return [];
    }

    const newMatrix = data.distinct_thicknesses.map((thickness) =>
      data.distinct_formats.map((format) =>
        data.final_products.some(
          (product) =>
            product.thickness_in_mm === thickness &&
            product.format.length_in_mm === format.length_in_mm &&
            product.format.width_in_mm === format.width_in_mm
        )
      )
    );
    console.log(newMatrix);
    return newMatrix;
  };

  return (
    loading ? (
      <LoadingSpinner />
    ) : (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePressProductType(item)}
      >
        <View style={styles.container}>
          <View style={styles.overview}>
            <View style={styles.imageContainer}>
              {imageLoading && (
                <ActivityIndicator
                  style={styles.loadingSpinner}
                  size="large"
                  color={Colors.primary}
                />
              )}
              <Image
                resizeMode="cover"
                style={styles.image}
                source={{ uri: correctPhotoSource(item.photo_url) }}
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(e) => {
                  console.log("Image failed to load", e.nativeEvent.error);
                  setImageLoading(false);
                }}
              />
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.idemContainer}>
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        visible={modalVisible && finalProducts.length > 0}
        transparent={true}
        animationType="slide"
        onRequestClose={() => handleCloseModal()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => handleCloseModal()}
              style={styles.closeModalButton}
            >
              <Ionicons name="close-sharp" size={40} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.heading}>
              <Text style={styles.modalTitle}>Stock usine</Text>
              <Text style={styles.modalSubtitle}>(dimensions en mm)</Text>
              <Ionicons
                              name="ellipse-sharp"
                              color="green"
                              size={20}
                              style={{marginTop: 10}}
                            />
            </View>
            <View style={styles.content}>
            <View style={styles.headingContent}>
              {formats &&
                formats.map((format: FormatProductProps, index: number) => (
                  <Text key={index} style={styles.modalTextFormat}>
                    {format.length_in_mm}{'\n'} x {'\n'}{format.width_in_mm}
                  </Text>
                ))}
            </View>
            <View style={styles.dataContent}>
              {thicknesses &&
                thicknesses.map((thickness: number, indexThickness: number) => (
                  <View key={indexThickness} style={styles.row}>
                    <Text style={styles.modalTextThicknesses}>{thickness}</Text>
                    <View style={styles.dotContainer}>
                    {formats &&
                      gridMatrix.length > 0 &&
                      formats.map(
                        (format: FormatProductProps, indexFormat: number) =>
                          gridMatrix[indexThickness][indexFormat] ? (
                            <Ionicons
                              key={indexFormat}
                              name="ellipse-sharp"
                              color="green"
                              size={16}
                            />
                          ) : (
                            <Ionicons
                              key={indexFormat}
                              name="ellipse-outline"
                              color={Colors.black}
                              size={16}
                            />
                          )
                      )}
                      </View>
                  </View>
                ))}
            </View>

            </View>
          </View>
        </View>
      </Modal>
    </View>
  ))
};

export default ProductTypeCatalogueCard;
