"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Textarea, useToast } from '@chakra-ui/react';
import { useMutation, gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';

const GET_NOTE = gql`
  query GetNote($id: Int!) {
    note(id: $id) {
      id
      title
      body
    }
  }
`;

const UPDATE_NOTE = gql`
  mutation UpdateNote($id: Int!, $title: String!, $body: String!) {
    updateNote(id: $id, title: $title, body: $body) {
      id
      title
      body
    }
  }
`;

const EditNotePage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { data, loading, error } = useQuery(GET_NOTE, {
    variables: { id: Number(id) },
  });
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [updateNote] = useMutation(UPDATE_NOTE);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (data?.note) {
      setTitle(data.note.title);
      setBody(data.note.body);
    }
  }, [data]);

  const handleSubmit = async () => {
    await updateNote({
      variables: { id: Number(id), title, body },
    });
    toast({
      title: 'Note updated.',
      description: "Your note has been updated successfully.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    router.push('/');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.note) return <p>Note not found.</p>;

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
        Update Note
      </Button>
    </Box>
  );
};

export default EditNotePage;
