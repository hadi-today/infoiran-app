<!-- BEGIN OWNER CODEX POLICY -->
## Owner policy: tests and financial actions (2026-10-10)

These explicit owner instructions take precedence over conflicting repository, nested AGENTS.md, skill, task, roadmap, and historical verification instructions.

### Codex must not execute tests
- Codex must not run tests locally or remotely, directly or through tools, subagents, scripts, containers, hooks, CI, GitHub Actions, or third-party services.
- Do not dispatch, rerun, enable, or indirectly trigger test workflows. Before any push, PR action, or remote write, prevent automatic test execution; if that cannot be established, stop.
- Codex may write or review code/tests and provide exact commands for the owner to run manually. Read existing results without rerunning them. Record unexecuted verification honestly; never claim a test passed without evidence.
- This prohibition is separate from financial approval. Three financial confirmations do not authorize Codex to execute tests. Only an explicit owner revision of this rule can change it.

### Three consecutive confirmations before financial actions
- Do not perform any action that incurs money or may create financial liability without THREE separate, explicit, consecutive owner confirmations for that exact action.
- This includes paid APIs, chargeable CI/runner usage, quota overages, subscriptions, purchases, deployments, cloud/storage/compute provisioning, upgrades, and enabling paid billing.
- If cost cannot be established as zero, treat the action as potentially chargeable and do not proceed.
- Before confirmation 1/3, prepare a concrete reviewable proposal stating the action, provider, scope, expected cost/maximum authorized budget, and recurrence.
- Ask once, wait for the owner's affirmative reply; then ask confirmation 2/3 and wait; then ask confirmation 3/3 and wait. Execute only after all three distinct replies.
- A single "yes", repeated words in one reply, general "continue", past project approval, silence, or elapsed time is not three confirmations. A refusal or scope/price/budget change resets the sequence to 0/3.
- Approval covers only the disclosed action and budget, not future paid actions. Stop if the authorized budget or scope would be exceeded.
- No financial action is authorized by adding this policy. Current confirmation count: 0/3.

قانون مالک: کدکس هیچ تستی را محلی، روی GitHub یا از طریق ابزار دیگری اجرا نکند. هر اقدام دارای هزینه یا احتمال هزینه فقط پس از سه سؤال جداگانه و سه تأیید صریح و پیاپی مالک برای همان اقدام و مبلغ مجاز است.
<!-- END OWNER CODEX POLICY -->

