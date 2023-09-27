import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
    .version('1.0.0')
    .description('Tiny Hops CLI for managing and monitoring workflows');

program
    .command('generate-template')
    .description('Generate a template configuration file')
    .action(() => {
        console.log(chalk.green('Generating template...'));
        // Implementation here...
    });

program
    .command('run <config>')
    .option('-d, --deposit <amount>', 'Deposit amount in ETH')
    .description('Run a workflow with a specified configuration file')
    .action((config, options) => {
        console.log(chalk.green(`Running workflow with config: ${chalk.cyan(config)} and deposit: ${chalk.yellow(options.deposit)}`));
        // Implementation here...
    });

program
    .command('monitor <workflowId> <config>')
    .description('Monitor a running workflow')
    .action((workflowId, config) => {
        console.log(chalk.green(`Monitoring workflow: ${chalk.cyan(workflowId)} with config: ${chalk.cyan(config)}`));
        // Implementation here...
    });

program
    .command('pause <workflowId>')
    .description('Pause a running workflow')
    .action((workflowId) => {
        console.log(chalk.green(`Pausing workflow: ${chalk.cyan(workflowId)}`));
        // Implementation here...
    });

// Override the helpInformation method to colorize the arguments
program.configureHelp({
    // Sort commands alphabetically
    sortSubcommands: true,
    // Colorize the output
    formatHelp: (cmd, helper) => {
        const colorize = (str: string) => chalk.cyanBright(str);
        const format = (str: string) => chalk.bold(str);
        const formatOption = (str: string) => chalk.yellow(str);
        const formatCommand = (str: string) => chalk.green(str);

        const desc = cmd.description() ? `\n${cmd.description()}\n` : '';
        const usage = `${format('Usage:')} ${formatCommand(cmd.name())} ${colorize(cmd.usage())}\n`;

        let options = '';
        cmd.options.forEach((option) => {
            const optionFlags = option.flags;
            const optionDescription = option.description;
            options += `  ${formatOption(optionFlags)}\t${optionDescription}\n`;
        });
        if (options) {
            options = `\n${format('Options:')}\n${options}`;
        }

        let commands = '';
        cmd.commands.forEach((command) => {
            const commandName = command.name();
            const commandDescription = command.description();
            commands += `  ${formatCommand(commandName)}\t${commandDescription}\n`;
        });
        if (commands) {
            commands = `\n${format('Commands:')}\n${commands}`;
        }

        return `${usage}${desc}${options}${commands}`;
    },
});

program.parseAsync(process.argv);
