import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  Text,
  FormErrorMessage,
  Icon,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => void;
  type: "approve" | "reject";
  applicationNumber: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  applicationNumber,
}) => {
  const [comments, setComments] = useState("");
  const [isError, setIsError] = useState(false);

  const isApprove = type === "approve";

  // Reset state when modal opens/closes to prevent "ghost" data
  useEffect(() => {
    if (!isOpen) {
      setComments("");
      setIsError(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    // Validation: Rejection MUST have a reason
    if (!isApprove && !comments.trim()) {
      setIsError(true);
      return;
    }

    onConfirm(comments.trim() || (isApprove ? "Approved" : "Rejected"));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottomWidth="1px" py={4}>
          <HStack spacing={2}>
            <Icon 
              as={isApprove ? FiCheckCircle : FiXCircle} 
              color={isApprove ? "green.500" : "red.500"} 
            />
            <Text>Confirm {isApprove ? "Approval" : "Rejection"}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.500">Application Number:</Text>
              <Badge variant="outline" fontFamily="mono">{applicationNumber}</Badge>
            </HStack>

            <Text fontWeight="medium" fontSize="md">
              {isApprove
                ? "Are you sure you want to approve this request?"
                : "Please specify why this application is being rejected."}
            </Text>

            <FormControl isInvalid={isError}>
              <FormLabel fontSize="sm" fontWeight="bold">
                {isApprove ? "Approval Comments (Optional)" : "Reason for Rejection"}
              </FormLabel>
              <Textarea
                value={comments}
                onChange={(e) => {
                  setComments(e.target.value);
                  if (isError) setIsError(false);
                }}
                placeholder={
                  isApprove
                    ? "e.g., Handover completed, coverage confirmed..."
                    : "e.g., Insufficient notice period, overlapping team leave..."
                }
                rows={4}
                focusBorderColor={isApprove ? "green.400" : "red.400"}
              />
              {isError && (
                <FormErrorMessage>
                  <Icon as={FiAlertCircle} mr={1} />
                  A reason is required for rejection.
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderBottomRadius="xl" py={4}>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme={isApprove ? "green" : "red"}
            onClick={handleConfirm}
            px={8}
            boxShadow="sm"
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
          >
            Confirm {isApprove ? "Approve" : "Reject"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};