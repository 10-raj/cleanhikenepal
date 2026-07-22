/*
  # Remove unused About Page sections: values, story

  The admin About Page Manager allowed creating "Values" and "Story"
  content items, but no public page ever rendered them — dead
  functionality. This removes any such rows and tightens the section
  CHECK constraint to the sections actually used by the site (founders,
  history, mission, vision).
*/

DELETE FROM about_content WHERE section IN ('values', 'story');

ALTER TABLE about_content DROP CONSTRAINT IF EXISTS about_content_section_check;
ALTER TABLE about_content
  ADD CONSTRAINT about_content_section_check
  CHECK (section IN ('founders', 'history', 'mission', 'vision'));
