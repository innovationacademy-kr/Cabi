export abstract class IBlackholeRepository {
	abstract deleteBlackholedUser(intra_id: string): Promise<void>;
}
