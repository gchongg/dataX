import { useState } from "react";
import { ethers } from "ethers";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useAccount, useSigner } from "wagmi";
import { PinataSDK } from "pinata";
import abi from "../abis/ddm.json"; // Adjust to your ABI file path

const CONTRACT_ADDRESS = "0xDE62cFAbBF894a664cBdA497b469B7779E56Aa15";

const PublishDatasetPage = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const toast = useToast();

  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  // Pinata SDK Initialization
  const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT!;
  const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;
  const pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: GATEWAY_URL,
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Sell Dataset: Upload File to IPFS and Publish to Blockchain
  const sellDataset = async () => {
    if (!signer) {
      toast({
        title: "Wallet not connected.",
        description: "Please connect your wallet first.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please select a file before publishing.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsPublishing(true);

      // Step 1: Upload file to IPFS
      const blob = new Blob([file], { type: file.type });
      const upload = await pinata.upload.file(new File([blob], file.name, { type: file.type }));
      const ipfsHash = upload.cid;

      toast({
        title: "File uploaded to IPFS.",
        description: `CID: ${ipfsHash}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Step 2: Publish dataset details to the blockchain
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
      const priceInWei = ethers.utils.parseEther(price);

      const tx = await contract.sellDataset(name, description, ipfsHash, priceInWei);
      toast({
        title: "Transaction submitted.",
        description: "Waiting for confirmation...",
        status: "info",
        duration: 5000,
        isClosable: true,
      });

      await tx.wait();
      toast({
        title: "Dataset listed successfully.",
        description: "Your dataset has been listed for sale.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear the form after success
      setName("");
      setDescription("");
      setFile(null);
      setPrice("");
    } catch (error) {
      console.error("Error during the sell process:", error);
      toast({
        title: "Error occurred.",
        description: "Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={5} align="stretch" maxW="400px" mx="auto">
        <Heading as="h1" size="lg" textAlign="center">
          Publish a Dataset
        </Heading>

        {!isConnected && (
          <Text textAlign="center" color="red.500">
            Please connect your wallet to list a dataset.
          </Text>
        )}

        <FormControl id="name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Dataset Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isDisabled={!isConnected || isPublishing}
          />
        </FormControl>

        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder="Dataset Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            isDisabled={!isConnected || isPublishing}
          />
        </FormControl>

        <FormControl id="file" isRequired>
          <FormLabel>Upload File</FormLabel>
          <Input
            type="file"
            onChange={handleFileChange}
            isDisabled={!isConnected || isPublishing}
          />
          {file && <Text mt={2}>Selected file: {file.name}</Text>}
        </FormControl>

        <FormControl id="price" isRequired>
          <FormLabel>Price (wei)</FormLabel>
          <Input
            type="number"
            placeholder="Dataset Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            isDisabled={!isConnected || isPublishing}
          />
        </FormControl>

        <Button
          colorScheme="green"
          onClick={sellDataset}
          isDisabled={
            !isConnected || !name || !description || !file || !price || isPublishing
          }
        >
          {isPublishing ? (
            <>
              Publishing... <Spinner size="sm" ml={2} />
            </>
          ) : (
            "Sell Dataset"
          )}
        </Button>
      </VStack>
    </Box>
  );
};

export default PublishDatasetPage;
