"use client";

import React, { useState } from 'react';
import { Box, Button, Input, Textarea, useToast } from '@chakra-ui/react';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $body: String!) {
    createNote(title: $title, body: $body) {
      id
      title
      body
      createdAt
    }
  }
`;

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

const AddNotePage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [createNote] = useMutation(CREATE_NOTE, {
    refetchQueries: [{ query: GET_NOTES }],
    onCompleted: () => {
      toast({
        title: 'Note created.',
        description: "Your note has been added successfully.",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      router.push('/');
    },
  });
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async () => {
    await createNote({
      variables: { title, body },
    });
  };

  return (
    <Box p={5}>
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={3}
      />
      <Textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        mb={3}
      />
      <Button colorScheme="teal" onClick={handleSubmit}>
        Add Note
      </Button>
    </Box>
  );
};

export default AddNotePage;
