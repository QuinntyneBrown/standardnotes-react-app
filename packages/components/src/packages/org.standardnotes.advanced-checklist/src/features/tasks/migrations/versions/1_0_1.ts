import BaseMigration, { PartialData } from '../BaseMigration'

class Migration1_0_1 extends BaseMigration {
  protected override get version(): string {
    return '1.0.1'
  }

  protected override upgrade(data: PartialData): PartialData {
    const groups = data.groups.map(({ collapsed, ...group }) => ({
      ...group,
      ...(collapsed && {
        collapsed: {
          group: Boolean(collapsed),
        },
      }),
    }))
    return {
      schemaVersion: this.version,
      groups,
    }
  }

  protected override downgrade(data: PartialData): PartialData {
    return {
      ...data,
      schemaVersion: this.version,
    }
  }
}

export default Migration1_0_1
