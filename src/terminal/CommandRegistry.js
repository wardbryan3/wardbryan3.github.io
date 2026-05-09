export class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.history = [];
  }

  register(name, handler, description) {
    this.commands.set(name.toLowerCase(), { handler, description });
  }

  get(name) {
    return this.commands.get(name.toLowerCase());
  }

  list() {
    return [...this.commands.entries()].map(([name, cmd]) => ({
      name,
      description: cmd.description,
    }));
  }

  execute(name, args, context) {
    const cmd = this.get(name);
    if (!cmd) return { output: `command not found: ${name}` };
    this.history.push(`${name}${args.length ? ' ' + args.join(' ') : ''}`);
    return cmd.handler(args, context);
  }

  getHistory() {
    return [...this.history];
  }
}
