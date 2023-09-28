import { Command } from 'commander';
import chalk from 'chalk';
import { convertThopsToWorkflow } from '../lib';
import { startWorkflowCmd } from '../commands';
import { workflowStatus } from '../commands/monitor';

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
        startWorkflowCmd(config, options.deposit);
               // Implementation here...
    });

program
    .command('status <workflowId> <config>')
    .description('See the status of a workflow')
    .action((workflowId, config) => {
        console.log(chalk.green(`Displaying workflow status: ${chalk.cyan(workflowId)} with config: ${chalk.cyan(config)}`));
        workflowStatus(workflowId, config)
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
