"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Button, SimpleGrid, Text, useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_NOTES = gql`
  query GetNotes {
    notes {
      id
      title
      body
      createdAt
    }
  }
`;

const DELETE_NOTE = gql`
  mutation DeleteNote($id: Int!) {
    deleteNote(id: $id) {
      id
    }
  }
`;

interface Note {
  id: number;
  title: string;
  body: string;
  createdAt: string;
}

const MainPage = () => {
  const { loading, error, data } = useQuery(GET_NOTES);
  const [deleteNote] = useMutation(DELETE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
    onCompleted: () => {
      toast({
        title: "Note deleted.",
        description: "The note was successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
  });
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setNotes(data.notes);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDelete = async (id: number) => {
    await deleteNote({
      variables: { id },
    });
  };

  const handleViewDetails = (note: Note) => {
    setSelectedNote(note);
    onOpen();
  };

  return (
    <Box p={5}>
      {notes.length === 0 ? (
        <Text>Tidak Ada Data</Text>
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={10}>
          {notes.map((note) => (
            <Box key={note.id} p={5} shadow="md" borderWidth="1px">
              <Text mt={4} fontWeight="bold">{note.title}</Text>
              <Text mt={4} noOfLines={1}>{note.body}</Text>
              <Button mt={4} colorScheme="blue" onClick={() => handleViewDetails(note)}>View</Button>
              <Link href={`/editNote/${note.id}`} passHref>
                <Button mt={4} ml={2} colorScheme="teal">Edit</Button>
              </Link>
              <Button
                mt={4}
                ml={2}
                colorScheme="red"
                onClick={() => handleDelete(note.id)}
              >
                Delete
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}

      <Link href="/addNote" passHref>
        <Button
          position="fixed"
          bottom="4"
          right="4"
          colorScheme="teal"
        >
          Add Note
        </Button>
      </Link>

      {selectedNote && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedNote.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontSize="sm" color="gray.500">{selectedNote.createdAt}</Text>
              <Text mt={4}>{selectedNote.body}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default MainPage;
