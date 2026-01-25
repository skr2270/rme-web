'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import JSZip from 'jszip';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { SidebarNav } from '@/components/molecules/SidebarNav';
import { DashboardShell } from '@/components/organisms/DashboardShell';
import { graphqlRequest } from '@/lib/graphql';
import { clearAdminToken, getAdminRole, getAdminToken } from '@/lib/adminAuth';

type Agent = {
  id: string;
  name?: string | null;
  phoneNumber: string;
  email?: string | null;
};

type QrBatchItem = {
  qrCode: { id: string; code: string; batchMonth: string; batchNumber: number; batchSequence: number };
  dataUrl: string;
};

type SectionKey = 'agents' | 'qrcodes';

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M16 11a4 4 0 1 0-8 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M3 21c0-4.418 3.582-8 8-8h2c4.418 0 8 3.582 8 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconQr = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 4h6v6H4V4Z" stroke="currentColor" strokeWidth="2" />
    <path d="M14 4h6v6h-6V4Z" stroke="currentColor" strokeWidth="2" />
    <path d="M4 14h6v6H4v-6Z" stroke="currentColor" strokeWidth="2" />
    <path d="M14 14h3v3h-3v-3Z" stroke="currentColor" strokeWidth="2" />
    <path d="M19 19h1" stroke="currentColor" strokeWidth="2" />
    <path d="M19 14h1" stroke="currentColor" strokeWidth="2" />
    <path d="M14 19h1" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('agents');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');
  const [agentFilter, setAgentFilter] = useState<'all' | 'active'>('active');
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentPhone, setAgentPhone] = useState('');
  const [agentEmail, setAgentEmail] = useState('');
  const [agentLoading, setAgentLoading] = useState(false);

  const [batchCount, setBatchCount] = useState(50);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batch, setBatch] = useState<{ batchMonth: string; batchNumber: number; items: QrBatchItem[] } | null>(null);

  const normalizedAgentPhone = useMemo(() => {
    const digits = (agentPhone || '').replace(/\D/g, '').slice(0, 10);
    return digits ? `+91${digits}` : '';
  }, [agentPhone]);

  const filteredAgents = useMemo(() => {
    const query = agentSearch.trim().toLowerCase();
    let list = agents;
    if (agentFilter === 'active') {
      list = agents;
    }
    if (!query) return list;
    return list.filter((agent) => {
      const name = (agent.name || '').toLowerCase();
      const phone = (agent.phoneNumber || '').toLowerCase();
      const email = (agent.email || '').toLowerCase();
      return name.includes(query) || phone.includes(query) || email.includes(query);
    });
  }, [agents, agentFilter, agentSearch]);

  useEffect(() => {
    const role = getAdminRole();
    const t = getAdminToken();
    if (!t || role !== 'SUPER_ADMIN') {
      router.replace('/admin/login');
      return;
    }
    setToken(t);
  }, [router]);

  const handleLogout = () => {
    clearAdminToken();
    router.replace('/admin/login');
  };

  const loadAgents = async () => {
    if (!token) return;
    setLoadingAgents(true);
    setError(null);
    try {
      const data = await graphqlRequest<{ agents: Agent[] }>(
        `query Agents {
          agents {
            id
            name
            phoneNumber
            email
          }
        }`,
        undefined,
        'Agents',
        { authToken: token },
      );
      setAgents(data.agents || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load agents');
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    if (token) loadAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const createAgent = async () => {
    if (!token) return;
    setAgentLoading(true);
    setError(null);
    try {
      await graphqlRequest(
        `mutation CreateAgentUser($input: CreateAgentInput!) {
          createAgentUser(input: $input) { id }
        }`,
        { input: { phoneNumber: normalizedAgentPhone, name: agentName, email: agentEmail || null } },
        'CreateAgentUser',
        { authToken: token },
      );
      setAgentName('');
      setAgentPhone('');
      setAgentEmail('');
      setShowAddAgent(false);
      loadAgents();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create agent');
    } finally {
      setAgentLoading(false);
    }
  };

  const deactivateAgent = async (agentId: string) => {
    if (!token) return;
    setError(null);
    try {
      await graphqlRequest(
        `mutation DeactivateAgent($agentId: String!) {
          deactivateAgent(agentId: $agentId) { id }
        }`,
        { agentId },
        'DeactivateAgent',
        { authToken: token },
      );
      loadAgents();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to deactivate agent');
    }
  };

  const generateBatch = async () => {
    if (!token) return;
    setBatchLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest<{
        generateQrCodeBatch: { batchMonth: string; batchNumber: number; items: QrBatchItem[] };
      }>(
        `mutation GenerateQrCodeBatch($input: GenerateQrBatchInput!) {
          generateQrCodeBatch(input: $input) {
            batchMonth
            batchNumber
            items {
              dataUrl
              qrCode {
                id
                code
                batchMonth
                batchNumber
                batchSequence
              }
            }
          }
        }`,
        { input: { count: batchCount, source: 'ADM' } },
        'GenerateQrCodeBatch',
        { authToken: token },
      );
      setBatch(data.generateQrCodeBatch);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate batch');
    } finally {
      setBatchLoading(false);
    }
  };

  const downloadZip = async () => {
    if (!batch?.items?.length) return;
    const zip = new JSZip();
    batch.items.forEach((item) => {
      const base64 = item.dataUrl.split(',')[1] || '';
      zip.file(`${item.qrCode.code}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-batch-${batch.batchMonth}-${batch.batchNumber}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const batchLabel = useMemo(() => {
    if (!batch) return null;
    return `Batch ${batch.batchMonth}-${String(batch.batchNumber).padStart(3, '0')}`;
  }, [batch]);

  return (
    <>
      <DashboardShell
        title="Super Admin Portal"
        subtitle="Manage agents and QR code batches."
        logoSrc="/RME3.png"
        logoAlt="RME"
        actions={
          <Button onClick={handleLogout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl">
            Logout
          </Button>
        }
        alerts={error ? <div className="text-sm text-red-600">{error}</div> : null}
        sidebar={
          <SidebarNav
            items={[
              {
                id: 'agents',
                label: 'Manage Agents',
                icon: <IconUsers />,
                active: activeSection === 'agents',
                onClick: () => setActiveSection('agents'),
              },
              {
                id: 'qrcodes',
                label: 'Generate QR Codes',
                icon: <IconQr />,
                active: activeSection === 'qrcodes',
                onClick: () => setActiveSection('qrcodes'),
              },
            ]}
          />
        }
      >
        <section className="min-h-[480px] space-y-6">
          {activeSection === 'agents' && (
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-gray-900">Manage Agents</div>
                  <div className="text-sm text-gray-500">Create and deactivate agent logins.</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={loadAgents} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl">
                    Refresh
                  </Button>
                  <Button
                    onClick={() => setShowAddAgent(true)}
                    className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-xl"
                  >
                    Add Agent
                  </Button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50/70 border border-gray-100 p-3">
                <div className="flex flex-wrap gap-3">
                  <Input
                    type="text"
                    placeholder="Search by name, phone, or email"
                    value={agentSearch}
                    onChange={(e) => setAgentSearch(e.target.value)}
                    className="flex-1 min-w-[240px] px-4 py-3 border border-gray-200 rounded-2xl bg-white"
                  />
                  <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value as 'all' | 'active')}
                    className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-100 text-xs font-semibold text-gray-600">
                  <div>Name</div>
                  <div>Mobile</div>
                  <div>Email</div>
                  <div className="text-right">Action</div>
                </div>
                <div className="divide-y divide-gray-100">
                  {loadingAgents ? (
                    <div className="px-5 py-8 text-sm text-gray-600">Loading agents…</div>
                  ) : filteredAgents.length === 0 ? (
                    <div className="px-5 py-8 text-sm text-gray-600">No agents created yet.</div>
                  ) : (
                    filteredAgents.map((agent) => (
                      <div key={agent.id} className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-5 py-4 text-sm text-gray-700">
                        <div className="font-semibold text-gray-900 flex items-center gap-2">
                          {agent.name || '—'}
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Active
                          </span>
                        </div>
                        <div>{agent.phoneNumber}</div>
                        <div className="truncate">{agent.email || '—'}</div>
                        <div className="text-right">
                          <Button
                            onClick={() => deactivateAgent(agent.id)}
                            className="bg-red-50 text-red-600 px-3 py-2 rounded-xl"
                          >
                            Deactivate
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'qrcodes' && (
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <div className="text-xl font-bold text-gray-900">Generate QR Codes</div>
              <div className="text-sm text-gray-500">Create batch QR codes and download as ZIP.</div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
                <Input
                  type="number"
                  placeholder="Count"
                  value={String(batchCount)}
                  onChange={(e) => setBatchCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
                />
                <Button
                  onClick={generateBatch}
                  disabled={batchLoading || batchCount <= 0}
                  className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-3 rounded-2xl font-bold"
                >
                  {batchLoading ? 'Generating…' : 'Generate Batch'}
                </Button>
              </div>

              {batch ? (
                <div className="mt-6">
                  <div className="text-sm font-semibold text-gray-700">{batchLabel}</div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Button onClick={downloadZip} className="bg-gray-900 text-white px-4 py-2 rounded-xl">
                      Download ZIP
                    </Button>
                    <div className="text-sm text-gray-500">{batch.items.length} QR codes</div>
                  </div>
                </div>
              ) : null}

              {batch?.items?.length ? (
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {batch.items.map((item) => (
                    <div key={item.qrCode.id} className="rounded-2xl border border-gray-100 p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.dataUrl} alt={item.qrCode.code} className="w-full" />
                      <div className="mt-2 text-xs text-gray-700 break-all">{item.qrCode.code}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </DashboardShell>

      {showAddAgent ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="text-xl font-bold text-gray-900">Add New Agent</div>
            <div className="mt-2 text-sm text-gray-500">Enter agent details below.</div>

            <div className="mt-6 space-y-4">
              <Input
                type="text"
                placeholder="Agent name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
              />
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">+91</div>
                <Input
                  type="tel"
                  placeholder="10 digit mobile number"
                  value={agentPhone}
                  onChange={(e) => setAgentPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-12 pr-4 py-3 border-2 border-violet-100 rounded-2xl"
                  maxLength={10}
                />
              </div>
              <Input
                type="email"
                placeholder="Email (optional)"
                value={agentEmail}
                onChange={(e) => setAgentEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-violet-100 rounded-2xl"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <Button onClick={() => setShowAddAgent(false)} className="bg-gray-100 px-4 py-2 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={createAgent}
                disabled={!agentName.trim() || !normalizedAgentPhone || agentLoading}
                className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-xl"
              >
                {agentLoading ? 'Saving…' : 'Add Agent'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
