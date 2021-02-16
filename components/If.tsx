import React from 'react';

interface Props {
  condition: boolean;
}

export const If: React.FC<Props> = ({ condition, children }) => {
  return <>{(condition && children) || null}</>;
};
