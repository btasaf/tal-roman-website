# Listen to Agentation Feedback

Check for visual feedback annotations from the browser and act on them.

## Usage
`/listen`

## Instructions

When invoked:

1. **Check for annotations**: Call the `agentation_get_all_pending` MCP tool to fetch any pending UI feedback from the browser

2. **If annotations exist**:
   - Read each annotation carefully
   - Each contains: element selector, component path, and user feedback
   - Fix the issues in the code
   - After fixing, call `agentation_mark_resolved` for each resolved annotation

3. **If no annotations**: Tell the user "No pending feedback. Add annotations in the browser using the Agentation toolbar."

4. **After fixing**: Ask user to check the browser and add more annotations if needed

## Loop Mode

User can say `/listen loop` to continuously poll for new annotations:
- Check every few seconds
- Fix issues as they come in
- Keep going until user says stop

## Tips

- Agentation sends CSS selectors - use them to find exact elements
- Annotations include computed styles - helpful for debugging
- User feedback is in the `note` field
- Be precise - user pointed at exactly what's wrong
