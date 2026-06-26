# /ship

Run the full verification sequence before considering any change complete:

1. `npm run lint -- --fix`
2. `npx tsc --noEmit`
3. `npm run build`
4. If all three pass, stage and commit with a conventional commit message summarizing the change.
5. If any step fails, stop immediately and report the failure with the exact error — do not commit broken code, and do not attempt to "fix" it by changing styling files.
