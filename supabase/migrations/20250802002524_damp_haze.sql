/*
  # Add delete policy for signs table

  1. Security Changes
    - Add policy to allow anyone to delete signs (we handle password protection in the app)
    
  This allows the delete functionality to work properly.
*/

-- Allow anyone to delete signs (we'll handle password protection in the app)
CREATE POLICY "Anyone can delete signs"
  ON signs
  FOR DELETE
  TO public
  USING (true);